export type Category = {
  name: string;
  prices: {
    min: string;
    max: string;
  };
}

export type Animal = {
  name: string;
  category: Category[];
}

export type Rates = {
  titleSeason?: string;
  pricesList?: (string | null)[][];
};