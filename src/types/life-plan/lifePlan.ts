export type LifePlanItem = {
    name: string;
    value: number;
};

export type LifePlanCategory = {
    items: LifePlanItem[];
    total: number;
    newItem: {
        name: string;
        value: string;
    };
};

export type LifePlanData = {
    id: number;
    user: number;
    name: string;
    created_at: string;
    updated_at: string;
    items: {
        receitas: LifePlanCategory;
        estudos: LifePlanCategory;
        custos: LifePlanCategory;
        lucroPrejuizo: LifePlanCategory;
        investimentos: LifePlanCategory;
        realizacoes: LifePlanCategory;
        intercambio: LifePlanCategory;
        empresas: LifePlanCategory;
    };
};
