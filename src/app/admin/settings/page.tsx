import { getSiteSettings } from "@/db/queries";
import { updateHeroMedia, updateTrustTag } from "@/lib/actions/settings";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="font-serif text-2xl text-plum mb-2">Header trust tag</h1>
        <p className="text-sm text-ink/60 mb-6 max-w-lg">
          A short line of text shown next to the logo in the site header — good for a quick trust
          signal (e.g. a rating, a certification, a delivery promise). Leave empty to hide it.
        </p>
        <form action={updateTrustTag} className="flex gap-3 max-w-xl">
          <input
            type="text"
            name="trustTagText"
            defaultValue={settings.trustTagText ?? ""}
            placeholder="e.g. FSSAI Certified"
            maxLength={60}
            className="flex-1 border border-line rounded-lg px-3.5 py-2.5 text-sm"
          />
          <button type="submit" className="bg-plum text-cream rounded-full px-6 py-2.5 text-sm whitespace-nowrap">
            Save
          </button>
        </form>
      </div>

      <div className="border-t border-line pt-8">
        <h1 className="font-serif text-2xl text-plum mb-2">Homepage hero</h1>
        <p className="text-sm text-ink/60 mb-6 max-w-lg">
          The homepage hero shows a product photo floating over the big &quot;Slice of
          Happiness&quot; text. Upload a background-removed (transparent) product photo or a short
          looping video for the best effect — it gets cropped into a soft blob shape. Leave empty
          to show a plain gradient there instead.
        </p>

        <form action={updateHeroMedia} className="grid gap-5 max-w-xl">
          <div>
            <label className="block text-sm text-ink/70 mb-1.5">Media type</label>
            <select
              name="heroMediaType"
              defaultValue={settings.heroMediaType}
              className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
            >
              <option value="none">None — show the plain gradient</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <ImageUploadField
            name="heroDesktopUrl"
            label="Overlapping hero image or video"
            defaultValue={settings.heroDesktopUrl}
            folder="hero"
          />
          <input type="hidden" name="heroMobileUrl" value={settings.heroMobileUrl ?? ""} />

          <button type="submit" className="bg-plum text-cream rounded-full px-6 py-2.5 text-sm w-fit">
            Save hero media
          </button>
        </form>
      </div>
    </div>
  );
}
