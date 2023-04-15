type Category = {
  name: string;
  prices: {
    min: string;
    max: string;
  };
}
type Animal = {
  name: string;
  category: Category[];
}

type Rates = {
  titleSeason?: string;
  pricesList?: (string | null)[][];
};

const DataTable = ({titleSeason, pricesList}: Rates) => {
  if (titleSeason && pricesList) {
    return(
      <div className="prices-download">
        <p className="text-neutral-300 pb-2 text-xs">
          {titleSeason}
        </p>
        <table className="border-collapse table-auto w-full text-xs">
          <thead>
            <tr>
              <th colSpan={3} className="border border-slate-300">Hembras</th>
            </tr>
            <tr>
              <th className="bg-slate-50 border border-slate-300">Tipo</th>
              <th className="bg-slate-50 border border-slate-300">Mínimo</th>
              <th className="bg-slate-50 border border-slate-300">Máximo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300">Indiana</td>
              <td className="border border-slate-300">Indiana</td>
              <td className="border border-slate-300">Indianapolis</td>
            </tr>
            <tr>
              <td className="border border-slate-300">Indiana</td>
              <td className="border border-slate-300">Ohio</td>
              <td className="border border-slate-300">Columbus</td>
            </tr>
            <tr>
              <td className="border border-slate-300">Indiana</td>
              <td className="border border-slate-300">Michigan</td>
              <td className="border border-slate-300">Detroit</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div id='prices-default' className="flex items-center">
      <p className="text-neutral-300 pb-2 text-xs text-center">
        Debe cargar sus precios
      </p>
    </div>
  )
}

export default DataTable;