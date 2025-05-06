// Shared Components
import { Card, CardContent } from "../components/ui/Card";

export const StatCard = ({
  icon,
  title,
  value,
  tooltip,
  onClick,
  className,
  actionIcon,
  actionLabel,
}) => (
  <Card className={className} onClick={onClick}>
    <CardContent className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {tooltip && <p className="text-xs text-gray-500 mt-1">{tooltip}</p>}
        </div>
      </div>

      {actionIcon && actionLabel && (
        <div className="flex items-center text-sm text-gray-600 hover:text-blue-600">
          {actionIcon}
          <span className="ml-1">{actionLabel}</span>
        </div>
      )}
    </CardContent>
  </Card>
);
