import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AWSService } from '../data/awsData';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  service: AWSService;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  // Dynamically get the icon component from lucide-react
  const IconComponent = (Icons as any)[service.icon] || Icons.HelpCircle;

  const categoryColors: Record<string, string> = {
    Compute: 'bg-orange-100 text-orange-700 border-orange-200',
    Storage: 'bg-blue-100 text-blue-700 border-blue-200',
    Database: 'bg-purple-100 text-purple-700 border-purple-200',
    Networking: 'bg-green-100 text-green-700 border-green-200',
    Security: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
          <IconComponent className="w-6 h-6 text-slate-600 group-hover:text-orange-600" />
        </div>
        <span className={cn(
          "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
          categoryColors[service.category] || 'bg-slate-100 text-slate-700 border-slate-200'
        )}>
          {service.category}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
        {service.description}
      </p>
      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Common Use Case</p>
        <p className="text-sm text-slate-700 italic">"{service.useCase}"</p>
      </div>
    </motion.div>
  );
}
