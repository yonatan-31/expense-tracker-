import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface EmptyStateBannerProps {
  show: boolean;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const EmptyStateBanner = ({ show, onAddIncome, onAddExpense }: EmptyStateBannerProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mx-4 sm:mx-6 md:mx-0 py-4 md:py-10"
        >
          <div className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50" />
            <div className="relative px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                  Welcome! Let’s get started.
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Add your first income or expense to start tracking your finances.
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-3">
                <Button
                  onClick={onAddIncome}
                  variant="secondary"
                  size="lg"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Add Income
                </Button>
                <Button
                  onClick={onAddExpense}
                  variant="default"
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmptyStateBanner;



