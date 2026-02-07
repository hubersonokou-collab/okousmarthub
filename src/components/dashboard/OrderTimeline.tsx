import { CheckCircle, Clock, Package, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, CATEGORY_COLORS } from "@/lib/constants";

interface Order {
  id: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  total_amount: number;
  created_at: string;
  services: {
    name: string;
    category: string;
  } | null;
}

interface OrderTimelineProps {
  orders: Order[];
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
}

const statusIcons = {
  pending: Clock,
  in_progress: Package,
  completed: CheckCircle,
  cancelled: AlertCircle,
};

const statusSteps = ["pending", "in_progress", "completed"] as const;

export function OrderTimeline({ orders, formatPrice, formatDate }: OrderTimelineProps) {
  const getStepProgress = (status: keyof typeof ORDER_STATUS_LABELS) => {
    const index = statusSteps.indexOf(status as typeof statusSteps[number]);
    return index >= 0 ? ((index + 1) / statusSteps.length) * 100 : 0;
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas encore passé de commande.
          </p>
          <Button className="gradient-primary shadow-primary">
            Passer une commande
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const StatusIcon = statusIcons[order.status];
        const categoryColor = order.services?.category
          ? CATEGORY_COLORS[order.services.category as keyof typeof CATEGORY_COLORS]
          : null;
        const progress = getStepProgress(order.status);

        return (
          <Card key={order.id} className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Service Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {categoryColor && (
                      <div className={`p-3 rounded-xl ${categoryColor.bg} text-white shrink-0`}>
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold truncate">
                          {order.services?.name || "Service"}
                        </h4>
                        <Badge className={ORDER_STATUS_COLORS[order.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Commandé le {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="flex-1 lg:max-w-xs">
                  <div className="relative">
                    <div className="flex justify-between mb-2">
                      {statusSteps.map((step, index) => {
                        const isActive = statusSteps.indexOf(order.status as typeof statusSteps[number]) >= index;
                        const StepIcon = statusIcons[step];
                        return (
                          <div
                            key={step}
                            className={`flex flex-col items-center ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <StepIcon className="h-4 w-4" />
                            </div>
                            <span className="text-xs mt-1 hidden sm:block">
                              {ORDER_STATUS_LABELS[step]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-10">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                  <p className="text-xl font-bold">{formatPrice(order.total_amount)}</p>
                  <Button variant="ghost" size="sm" className="group/btn">
                    Détails
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
