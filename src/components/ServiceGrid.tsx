import type { Service } from "../types/service";
import ServiceCard from "./ServiceCard";

interface ServiceGridProps {
  services: Service[];
}

function ServiceGrid({ services }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          No services found
        </h2>

        <p className="mt-2 text-gray-500">
          Try changing your category or rating filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

export default ServiceGrid;