import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const blogRouter = Router();

blogRouter.get(
  "/",
  asyncHandler(async (_request, response) => {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, avatarUrl: true } },
        comments: {
          include: {
            user: { select: { name: true, avatarUrl: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    response.json(blogs);
  })
);

blogRouter.post(
  "/",
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler(async (request, response) => {
    const schema = z.object({
      title: z.string().min(5),
      slug: z.string().min(5),
      excerpt: z.string().min(12),
      content: z.string().min(50),
      coverImage: z.string().url().optional(),
      published: z.boolean().default(true)
    });

    const body = schema.parse(request.body);
    const blog = await prisma.blog.create({
      data: {
        ...body,
        authorId: request.auth!.userId
      }
    });

    response.status(201).json(blog);
  })
);

blogRouter.patch(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler(async (request, response) => {
    const blogId = String(request.params.id);
    const schema = z.object({
      title: z.string().min(5).optional(),
      slug: z.string().min(5).optional(),
      excerpt: z.string().min(12).optional(),
      content: z.string().min(50).optional(),
      coverImage: z.string().url().optional(),
      published: z.boolean().optional()
    });

    const body = schema.parse(request.body);
    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: body
    });

    response.json(blog);
  })
);

blogRouter.delete(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler(async (request, response) => {
    await prisma.blog.delete({ where: { id: String(request.params.id) } });
    response.status(204).send();
  })
);

blogRouter.post(
  "/:id/like",
  requireAuth,
  asyncHandler(async (request, response) => {
    const blogId = String(request.params.id);
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId: request.auth!.userId
        }
      }
    });

    if (!existingLike) {
      await prisma.blogLike.create({
        data: {
          blogId,
          userId: request.auth!.userId
        }
      });
    }

    const likeCount = await prisma.blogLike.count({ where: { blogId } });

    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: { likesCount: likeCount }
    });

    response.json(blog);
  })
);

blogRouter.post(
  "/:id/comments",
  requireAuth,
  asyncHandler(async (request, response) => {
    const blogId = String(request.params.id);
    const schema = z.object({
      content: z.string().min(3)
    });

    const body = schema.parse(request.body);
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        blogId,
        userId: request.auth!.userId
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    response.status(201).json(comment);
  })
);
