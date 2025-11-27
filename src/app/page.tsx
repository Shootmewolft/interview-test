import { FamiliesView } from '@/components/families';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto py-10 px-4 ">
        <FamiliesView />
      </div>
    </div>
  );
}
