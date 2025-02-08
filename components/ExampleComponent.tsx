import React from "react"
import { WarpBackground } from "./ui/warp-background"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"

export function ExampleComponent() {
  return (
    <WarpBackground>
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-80">
          <CardContent className="flex flex-col gap-2 p-4">
            <CardTitle>Congratulations on Your Promotion!</CardTitle>
            <CardDescription>
              Your hard work and dedication have paid off. We&apos;re thrilled to
              see you take this next step in your career. Keep up the fantastic
              work!
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </WarpBackground>
  )
} 