import DrgCombinationGenerator from "@/components/drg-combination-generator"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <DrgCombinationGenerator />
      </div>
    </main>
  )
}

