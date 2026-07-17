import React from 'react';

export const DashboardRekapBmd: React.FC = () => {
  const tableHeaders = ["Status Kendaraan", "Roda 2", "Roda 3", "Roda 4", "Truck", "Total Unit"];
  
  const simbakdaData = [
    { status: "Total Kendaraan", r2: 15, r3: 2, r4: 5, truck: 1, total: 23 },
    { status: "Ada STNK", r2: 10, r3: 2, r4: 5, truck: 1, total: 18 },
    { status: "Tanpa STNK", r2: 5, r3: 0, r4: 0, truck: 0, total: 5 },
    { status: "Terpakai Ada STNK", r2: 8, r3: 2, r4: 4, truck: 1, total: 15 },
    { status: "Terpakai Tanpa STNK", r2: 3, r3: 0, r4: 0, truck: 0, total: 3 },
    { status: "Tidak Terpakai Ada STNK", r2: 2, r3: 0, r4: 1, truck: 0, total: 3 },
    { status: "Tidak Terpakai Tanpa STNK", r2: 2, r3: 0, r4: 0, truck: 0, total: 2 },
    { status: "Rusak digudang", r2: 0, r3: 0, r4: 0, truck: 0, total: 0 },
  ];

  const nonSimbakdaData = [
    { status: "Total Kendaraan", r2: 5, r3: 1, r4: 2, truck: 0, total: 8 },
    { status: "Ada STNK", r2: 3, r3: 1, r4: 1, truck: 0, total: 5 },
    { status: "Tanpa STNK", r2: 2, r3: 0, r4: 1, truck: 0, total: 3 },
    { status: "Terpakai Ada STNK", r2: 3, r3: 1, r4: 1, truck: 0, total: 5 },
    { status: "Terpakai Tanpa STNK", r2: 2, r3: 0, r4: 1, truck: 0, total: 3 },
    { status: "Tidak Terpakai Ada STNK", r2: 0, r3: 0, r4: 0, truck: 0, total: 0 },
    { status: "Tidak Terpakai Tanpa STNK", r2: 0, r3: 0, r4: 0, truck: 0, total: 0 },
    { status: "Rusak digudang", r2: 0, r3: 0, r4: 0, truck: 0, total: 0 },
  ];

  const renderTable = (title: string, data: typeof simbakdaData) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 font-bold text-slate-700">
        {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th 
                  key={index} 
                  className={`bg-slate-100 text-xs text-slate-600 uppercase py-3 px-4 ${index === 0 ? 'text-left' : 'text-center'}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => {
              let rowClass = "hover:bg-slate-50/50 transition-colors";
              
              if (row.status === "Terpakai Ada STNK") {
                rowClass = "bg-blue-50/50 hover:bg-blue-50/70 transition-colors";
              } else if (row.status === "Terpakai Tanpa STNK") {
                rowClass = "bg-rose-50/70 text-rose-700 font-semibold hover:bg-rose-50/90 transition-colors";
              }

              return (
                <tr key={index} className={rowClass}>
                  <td className="py-3 px-4 font-medium">{row.status}</td>
                  <td className="py-3 px-4 text-center">{row.r2}</td>
                  <td className="py-3 px-4 text-center">{row.r3}</td>
                  <td className="py-3 px-4 text-center">{row.r4}</td>
                  <td className="py-3 px-4 text-center">{row.truck}</td>
                  <td className="py-3 px-4 text-center font-bold">{row.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">
          REKAPITULASI INVENTARIS KENDARAAN DINAS (BMD)
        </h1>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Kecamatan Ujung Pandang
        </p>
      </div>

      {renderTable("Total Kendaraan Yang Terdata di SIMBAKDA", simbakdaData)}
      {renderTable("Total Kendaraan Yang TIDAK Terdata di SIMBAKDA", nonSimbakdaData)}
    </div>
  );
};
