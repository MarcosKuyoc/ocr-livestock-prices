import { Animal, Rates } from "./data-table.types";

const DataTable = (rates: Rates) => {
  const {titleSeason, pricesList} = rates;
  if (pricesList) {
    for (const animals of pricesList) {
      console.log(animals);
    }
  }

  if (titleSeason && pricesList) {
    return(
      <div className="prices-download">
        <p className="text-neutral-300 pb-2 text-xs">
          {titleSeason}
        </p>
        {
          pricesList.map((animal: Animal) => (
            <div key={animal.name}>
              <table className="border-collapse table-auto w-full text-xs">
                <thead>
                  <tr>
                    <th colSpan={3} className="border border-slate-300">{animal.name}</th>
                  </tr>
                  <tr>
                    <th className="bg-slate-50 border border-slate-300">Tipo</th>
                    <th className="bg-slate-50 border border-slate-300">Mínimo</th>
                    <th className="bg-slate-50 border border-slate-300">Máximo</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    animal.category.map((item) => (
                      <tr key={animal.name}>
                        <td className="border border-slate-300">{item.name}</td>
                        {
                          item.prices.min === 'NaN' ? (
                            <td className="bg-red-600 border border-slate-300">{item.prices.min}</td>
                          ) : (
                            <td className="border border-slate-300">{item.prices.min}</td>
                          )
                        }
                        {
                          item.prices.max === 'NaN' ? (
                            <td className="bg-red-600 border border-slate-300">{item.prices.max}</td>
                          ) : (
                            <td className="border border-slate-300">{item.prices.max}</td>
                          )
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className="p-2"></div>
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <div id='prices-default' className="flex items-center">
      <p className="text-neutral-300 pb-2 text-xs text-center">
        {titleSeason}
      </p>
    </div>
  )
}

export default DataTable;