import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"

export default function TestsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tests</CardTitle>
          <CardDescription>
            View and manage your test cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display your test cases and test execution results.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}