import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";

const apps = [
  {
    id: "precos-custo",
    title: "Preços de Custo",
    description: "Consultar preços registrados e calculados",
    icon: DollarSign,
    route: "/custos/precos-custo",
  },
];

const Custos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Custos</h1>
          <p className="text-muted-foreground">Selecione um aplicativo para continuar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Card
              key={app.id}
              className="p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 bg-card/95 backdrop-blur-sm"
              onClick={() => navigate(app.route)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <app.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">{app.title}</h3>
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Custos;
