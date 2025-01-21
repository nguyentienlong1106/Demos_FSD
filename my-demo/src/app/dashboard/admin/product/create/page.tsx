// import { AddProductForm } from "@/features/create/ui/AddProductForm";
import { AddProductForm } from "@/features/create/ui/AddProductForm";
import { SubmitForm } from "@/features/create/ui/SubmitForm";

export default function AddProductPage() {
  return (
    <main className="p-6">
      <div className="flex flex-row w-auto gap-4">
        <div className="w-3/5">
          <AddProductForm />
        </div>
        <div className="w-1/5">
          <SubmitForm />
        </div>
      </div>
    </main>
  );
}
