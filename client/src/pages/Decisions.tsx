import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { type Decision } from "@shared/schema";
import { format } from "date-fns";

export default function Decisions() {
  const { data: decisions = [], isLoading } = useQuery<Decision[]>({ 
    queryKey: ["/api/decisions"] 
  });

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "yes":
        return <CheckCircle className="text-green-500" size={20} />;
      case "no":
        return <XCircle className="text-red-500" size={20} />;
      case "think_again":
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "yes":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "no":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "think_again":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "yes":
        return "Go for it!";
      case "no":
        return "Skip it";
      case "think_again":
        return "Think again";
      default:
        return "Pending";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="px-6 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <motion.header 
        className="gradient-bg text-white px-6 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold">Decision History</h1>
        <p className="text-white/80 text-sm mt-1">
          Your past purchase decisions and Smartie's advice
        </p>
      </motion.header>

      {/* Content */}
      <main className="px-6 -mt-6 relative z-20">
        {decisions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg text-center">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-lg font-semibold mb-2">No decisions yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start making purchase decisions and they'll appear here!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {decisions.map((decision, index) => (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{decision.itemName}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {decision.category}
                          </Badge>
                          <Badge 
                            className={`text-xs ${getRecommendationColor(decision.recommendation)}`}
                          >
                            {getRecommendationIcon(decision.recommendation)}
                            <span className="ml-1">{getRecommendationText(decision.recommendation)}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">£{decision.amount}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(decision.createdAt), "MMM dd, HH:mm")}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 smartie-gradient rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {decision.reasoning}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>Desire: {decision.desireLevel}/10</span>
                        <span>Urgency: {decision.urgency}/10</span>
                      </div>
                      {decision.followed !== null && (
                        <div className="flex items-center gap-1">
                          {decision.followed ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                          <span>{decision.followed ? "Followed" : "Ignored"}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav currentTab="decisions" />
    </div>
  );
}
