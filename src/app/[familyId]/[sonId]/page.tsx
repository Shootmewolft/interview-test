import { notFound } from "next/navigation";
import { NodeEditor } from "@/components/node";
import { getFamilyFb } from "@/services/firebase";
import { findNodeById } from "@/utils";

interface NodePageProps {
  params: Promise<{ familyId: string; sonId: string }>;
}

export default async function NodePage({ params }: NodePageProps) {
  const { familyId, sonId } = await params;
  const family = await getFamilyFb(familyId);

  if (!family) {
    notFound();
  }

  const node = findNodeById(family.sons, sonId);

  if (!node) {
    notFound();
  }

  return <NodeEditor family={family} node={node} />;
}
