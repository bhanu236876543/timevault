export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="text-zinc-500">Last updated: October 2, 2026</p>

      <div className="space-y-6 text-zinc-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">Acceptable Use</h2>
          <p>Local Loop is a community exchange platform. You agree to use the platform respectfully and honestly.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">Listing Rules</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Only list items you own and have the right to exchange.</li>
            <li>Items must be in usable condition (Like New, Good, or Fair).</li>
            <li>No prohibited items (illegal substances, dangerous goods, etc.).</li>
            <li>Accurately describe the item's condition and size.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">Meeting Safety</h2>
          <p>
            Local Loop provides the platform to connect, but the physical exchange is your responsibility.
            We strongly encourage meeting in <strong className="text-black">safe, public locations</strong>.
            Do not share your home address until you are comfortable.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">Liability</h2>
          <p>
            Local Loop is not responsible for the condition of items exchanged or any disputes
            that arise during the physical exchange process.
          </p>
        </section>
      </div>
    </div>
  );
}
