import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GastosSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton do saldo */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Skeleton da tabela */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
