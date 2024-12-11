import React from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

interface StatisticsReportProps {
  data: {
    projectsByCategory: Array<{ name: string; count: number }>;
    projectsByStatus: Array<{ name: string; count: number }>;
    reviewsOverTime: Array<{ date: string; count: number }>;
    scoreDistribution: Array<{ range: string; count: number }>;
  };
}

const StatisticsReport: React.FC<StatisticsReportProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <BarChart
            data={data.projectsByCategory}
            xKey="name"
            yKey="count"
            title="Proyectos por Categoría"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <PieChart
            data={data.projectsByStatus}
            nameKey="name"
            valueKey="count"
            title="Estado de los Proyectos"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <LineChart
            data={data.reviewsOverTime}
            xKey="date"
            yKey="count"
            title="Evolución de Revisiones"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <BarChart
            data={data.scoreDistribution}
            xKey="range"
            yKey="count"
            title="Distribución de Puntuaciones"
            color="#10b981"
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticsReport;