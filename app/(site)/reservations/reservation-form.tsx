"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { reservationSchema } from "@/lib/validation/reservation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof reservationSchema>;

export function ReservationForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      partySize: 2,
      dateTime: "",
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not submit reservation.");
      return;
    }

    setSuccess(true);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation details</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" aria-label="Phone" autoComplete="tel" {...form.register("phone")} />
            {form.formState.errors.phone ? (
              <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partySize">Party size</Label>
            <Input
              id="partySize"
              aria-label="Party size"
              type="number"
              min={1}
              max={20}
              {...form.register("partySize", { valueAsNumber: true })}
            />
            {form.formState.errors.partySize ? (
              <p className="text-sm text-red-600">{form.formState.errors.partySize.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dateTime">Date &amp; time</Label>
            <Input id="dateTime" aria-label="Date and time" type="datetime-local" {...form.register("dateTime")} />
            {form.formState.errors.dateTime ? (
              <p className="text-sm text-red-600">{form.formState.errors.dateTime.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" aria-label="Notes" {...form.register("notes")} />
            {form.formState.errors.notes ? (
              <p className="text-sm text-red-600">{form.formState.errors.notes.message}</p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-300 md:col-span-2">
              Reservation received! We’ll confirm soon.
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting} aria-label="Submit reservation">
            {form.formState.isSubmitting ? "Submitting..." : "Submit reservation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}


