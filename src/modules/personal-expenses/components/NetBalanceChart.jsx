import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

import Card from '../../../components/common/Card';
import EmptyState from '../../../components/common/EmptyState';
import { colors } from '../../../theme/colors';

export default function NetBalanceChart({ expenses, loanRecords }) {
  const { data, currentNet } = useMemo(() => {
    const changesByDate = new Map();

    const addChange = (date, amount) => {
      changesByDate.set(date, (changesByDate.get(date) || 0) + amount);
    };

    expenses.forEach((e) => addChange(e.date, -Number(e.amount)));

    loanRecords.forEach((r) => {
      if (r.type === 'Given') {
        addChange(r.date, Number(r.amount));
      } else if (r.type === 'Taken') {
        addChange(r.date, r.status === 'Pending' ? -Number(r.amount) : 0);
      }
    });

    const sortedDates = [...changesByDate.keys()].sort();

    let running = 0;
    const points = sortedDates.map((date) => {
      running += changesByDate.get(date);
      return { date, balance: running };
    });

    return { data: points, currentNet: running };
  }, [expenses, loanRecords]);

  if (!data.length) {
    return (
      <Card>
        <EmptyState
          message="No financial trend yet"
          subMessage="Add expenses or loan records to see your net position over time."
        />
      </Card>
    );
  }

  const isPositive = currentNet >= 0;

  // SPLIT COLORING: the line/fill should be green wherever the value is
  // above 0, and red wherever it's below 0 — not just one color for the
  // whole line based on the final value. Recharts doesn't support
  // per-point stroke color natively, so we use a gradient trick: build a
  // vertical gradient where the color changes at the exact pixel-height
  // fraction where the data crosses zero (`zeroOffset`), using the SAME
  // offset twice to create a hard split instead of a smooth blend.
  const values = data.map((d) => d.balance);
  const maxVal = Math.max(...values, 0);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;
  // Fraction from the TOP of the chart where y = 0 sits (gradients go
  // top-to-bottom, and the top of the chart is the highest value).
  const zeroOffset = Math.min(1, Math.max(0, maxVal / range));

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-text-primary font-medium">
            Net Financial Position
          </h3>
          <p className="text-text-secondary text-xs mt-0.5">
            Expenses + Loan Given (assets) − Loan Taken still Pending
            (liabilities)
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 font-semibold ${
            isPositive ? 'text-accent-green' : 'text-accent-red'
          }`}
        >
          {isPositive ? (
            <FiTrendingUp size={18} />
          ) : (
            <FiTrendingDown size={18} />
          )}
          PKR {Math.abs(currentNet).toLocaleString()}
          <span className="text-xs font-normal text-text-muted">
            {isPositive ? 'positive' : 'negative'}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            {/* Hard split at the zero-crossing point: green above, red below */}
            <linearGradient id="netBalanceStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset={zeroOffset} stopColor={colors.accent.green} />
              <stop offset={zeroOffset} stopColor={colors.accent.red} />
            </linearGradient>
            <linearGradient id="netBalanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={zeroOffset}
                stopColor={colors.accent.green}
                stopOpacity={0.25}
              />
              <stop
                offset={zeroOffset}
                stopColor={colors.accent.red}
                stopOpacity={0.25}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.navy[700]} />
          <XAxis
            dataKey="date"
            tick={{ fill: colors.text.muted, fontSize: 11 }}
          />
          <YAxis tick={{ fill: colors.text.muted, fontSize: 11 }} />
          <ReferenceLine
            y={0}
            stroke={colors.navy[700]}
            strokeDasharray="4 4"
          />
          <Tooltip
            contentStyle={{
              background: colors.navy[800],
              border: `1px solid ${colors.navy[700]}`,
              borderRadius: 8,
            }}
            labelStyle={{ color: colors.text.primary }}
            formatter={(value) => [
              `PKR ${Number(value).toLocaleString()}`,
              'Net Position',
            ]}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="url(#netBalanceStroke)"
            strokeWidth={2}
            fill="url(#netBalanceFill)"
            dot={{ r: 3, fill: colors.text.muted }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
