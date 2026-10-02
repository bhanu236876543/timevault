export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-zinc-500">Last updated: October 2, 2026</p>

      <div className="space-y-6 text-zinc-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">Information We Collect</h2>
          <p>We collect only the minimum information necessary to facilitate local clothing exchanges:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Info:</strong> Email and username for authentication and communication.</li>
            <li><strong>Listing Info:</strong> Photos, descriptions, and categories of the clothes you list.</li>
            <li><strong>Location Info:</strong> We collect your approximate location to find matches within a 1 km radius.</li>
            <li><strong>Exchange Info:</strong> Records of offers, meeting arrangements, and confirmations.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">How We Handle Location</h2>
          <p>
            Your privacy is paramount. We do not store or expose your exact residential address.
            Location data is used server-side to calculate distances and is represented as approximate
            coordinates to ensure you remain anonymous until you choose to meet someone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">Data Retention</h2>
          <p>We retain your data as long as your account is active. You may request account deletion at any time via settings.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information at any time.</p>
        </section>
      </div>
    </div>
  );
}
