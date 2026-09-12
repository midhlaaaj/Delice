import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { StoreForm } from "@/components/admin/store-form";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [store] = await db.select().from(stores).where(eq(stores.id, id)).limit(1);
  if (!store) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-plum mb-6">Edit {store.name}</h1>
      <StoreForm store={store} />
    </div>
  );
}
