import { FamiliesView } from "@/components/families";
import { getAllFamilies } from "@/services/family";

export default async function Home() {
  const families = await getAllFamilies();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto py-10 px-4">
        <FamiliesView initialFamilies={families} />
      </div>
    </div>
  );
}
