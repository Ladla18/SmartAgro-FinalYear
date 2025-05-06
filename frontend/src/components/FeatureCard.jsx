import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button"; 

export const FeatureCard = ({ icon, title, description, onFeatureSelect }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="flex flex-col items-center p-6">
      {icon}
      <h3 className="mt-4 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-center text-gray-600">{description}</p>

      <Button onButtonClick={onFeatureSelect} className="mt-4" title={title}>
        Access Tool
      </Button>
    </CardContent>
  </Card>
);
