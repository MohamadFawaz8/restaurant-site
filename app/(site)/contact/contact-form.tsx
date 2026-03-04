"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { contactSchema } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not send message.");
      return;
    }

    setSuccess(true);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact form</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" aria-label="Name" autoComplete="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" aria-label="Email" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" aria-label="Subject" {...form.register("subject")} />
            {form.formState.errors.subject ? (
              <p className="text-sm text-red-600">{form.formState.errors.subject.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" aria-label="Message" {...form.register("message")} />
            {form.formState.errors.message ? (
              <p className="text-sm text-red-600">{form.formState.errors.message.message}</p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-300 md:col-span-2">
              Message sent — thanks! We’ll reply soon.
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting} aria-label="Send message">
            {form.formState.isSubmitting ? "Sending..." : "Send message"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}


