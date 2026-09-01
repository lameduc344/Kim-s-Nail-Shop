export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const success = params.success === "1";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <main className="shell" style={{ maxWidth: 720, paddingTop: 48, paddingBottom: 72 }}>
      <p className="eyebrow">Kim&apos;s Nails • Stonecrest</p>
      <h1>Salon Check-In</h1>
      <p>Already here? Check in below and the front desk will know you&apos;re waiting.</p>

      {success ? (
        <section className="card" style={{ marginTop: 24 }}>
          <h2>You&apos;re checked in.</h2>
          <p>Please have a seat. A team member will call you when they&apos;re ready.</p>
        </section>
      ) : (
        <form action="/api/check-in" method="post" className="card" style={{ marginTop: 24, display: "grid", gap: 16 }}>
          {error ? <p role="alert">We couldn&apos;t complete that check-in. Please review the form or see the front desk.</p> : null}
          <label>
            Name
            <input name="customer_name" required minLength={2} maxLength={100} autoComplete="name" />
          </label>
          <label>
            Phone (optional)
            <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
          </label>
          <label>
            Appointment name or confirmation (optional)
            <input name="appointment_reference" maxLength={100} />
          </label>
          <label>
            Party size
            <input name="party_size" type="number" min={1} max={12} defaultValue={1} />
          </label>
          <button type="submit" className="button">Check In</button>
        </form>
      )}
    </main>
  );
}
