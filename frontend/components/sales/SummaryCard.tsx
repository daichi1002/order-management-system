import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
