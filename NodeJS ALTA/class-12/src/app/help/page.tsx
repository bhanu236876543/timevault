export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-zinc-500 mt-2">Everything you need to know about Local Loop.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Common Questions</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">How does the 1km radius work?</p>
              <p className="text-xs text-zinc-500">We use your approximate location to show listings within 1km. We never show exact addresses.</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">What if the item isn't as described?</p>
              <p className="text-xs text-zinc-500">You can report the listing and rate the user after the exchange. This helps our community stay honest.</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Do I have to pay for anything?</p>
              <p className="text-xs text-zinc-500">No, Local Loop is a free peer-to-peer exchange platform.</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Safety Tips</h2>
          <ul className="text-xs text-zinc-500 space-y-2 list-disc pl-4">
            <li>Always meet in a public, well-lit area.</li>
            <li>Bring a friend if possible.</li>
            <li>Inspect the item thoroughly before confirming the exchange.</li>
            <li>Trust your instincts; if something feels off, cancel the meeting.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
