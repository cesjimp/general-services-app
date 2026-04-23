import { 
  Zap, 
  Droplets, 
  Paintbrush, 
  Hammer, 
  Wrench, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  switch (cat) {
    case 'electricidad':
      return <Zap className="w-full h-full" />;
    case 'plomeria':
      return <Droplets className="w-full h-full" />;
    case 'pintura':
      return <Paintbrush className="w-full h-full" />;
    case 'carpinteria':
      return <Hammer className="w-full h-full" />;
    case 'refrigeracion':
      return <Settings className="w-full h-full" />;
    case 'mecanica':
      return <Wrench className="w-full h-full" />;
    case 'general':
      return <Settings className="w-full h-full" />;
    default:
      return <HelpCircle className="w-full h-full" />;
  }
};
