import { testimonials } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name}>
            <p className="text-lg leading-8">“{testimonial.quote}”</p>
            <div className="mt-8">
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
