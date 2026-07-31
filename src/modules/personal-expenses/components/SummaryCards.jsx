import {
  FiTrendingDown,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCreditCard,
} from 'react-icons/fi';
import Card from '../../../components/common/Card';

export default function SummaryCards({
  totalSpent = 0,
  totalGiven = 0,
  totalTaken = 0,
  netLoan = 0,
}) {
  const cards = [
    {
      label: 'Total Spent (This Month)',
      value: `PKR ${totalSpent.toLocaleString()}`,
      icon: FiTrendingDown,
      tone: 'text-accent-red bg-accent-red/10',
    },
    {
      label: 'Loan Given',
      value: `PKR ${totalGiven.toLocaleString()}`,
      icon: FiArrowUpRight,
      tone: 'text-accent-orange bg-accent-orange/10',
    },
    {
      label: 'Loan Taken',
      value: `PKR ${totalTaken.toLocaleString()}`,
      icon: FiArrowDownLeft,
      tone: 'text-accent-purple bg-accent-purple/10',
    },
    {
      label: 'Net Loan Balance',
      value: `PKR ${netLoan.toLocaleString()}`,
      icon: FiCreditCard,
      tone: 'text-accent-green bg-accent-green/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card
          key={card.label}
          hoverable
          className="animate-[fadeIn_0.35s_ease-out]"
          style={{
            animationDelay: `${i * 60}ms`,
            animationFillMode: 'backwards',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-text-secondary text-sm">{card.label}</p>
              <p className="text-text-primary text-2xl font-semibold mt-1.5">
                {card.value}
              </p>
            </div>
            <div className={`p-2.5 rounded-lg ${card.tone}`}>
              <card.icon size={18} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
