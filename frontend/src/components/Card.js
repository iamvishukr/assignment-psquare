export const Card = ({ children, className }) => (
  <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={` pb-2 mb-2 flex items-center justify-between ${className}`}>{children}</div>
);

export const CardTitle = ({ children }) => <h4 className=" text-sm text-gray-500">{children}</h4>;

export const CardContent = ({ children, className }) => (
  <div className={`space-y-2 ${className}`}>{children}</div>
);
