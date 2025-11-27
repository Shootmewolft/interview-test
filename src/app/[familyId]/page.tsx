import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FamilyTreeView } from "@/components/family-tree";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/consts";
import { getFamily } from "@/services/family";

interface FamilyPageProps {
  params: Promise<{ familyId: string }>;
}

export default async function FamilyPage({ params }: FamilyPageProps) {
  const { familyId } = await params;
  const family = await getFamily(familyId);

  if (!family) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto py-10 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={APP_ROUTES.HOME}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {family.name}
              </h1>
              {family.description && (
                <p className="text-zinc-500 dark:text-zinc-400">
                  {family.description}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-4">Árbol familiar</h2>
            <FamilyTreeView family={family} />
          </div>
        </div>
      </div>
    </div>
  );
}
