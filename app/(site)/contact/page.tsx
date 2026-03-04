import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/app/(site)/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge className="w-fit">Contact</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Send us a message</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
          Whether it’s feedback, a special request, or event planning — we’ll get back to you.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}


