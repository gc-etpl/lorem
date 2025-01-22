import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-6 bg-blue-100 text-blue-900">
      <h1 className="text-2xl font-bold">
        hello tailwind
        <Button>click me</Button>
      </h1>
    </div>
  );
}
