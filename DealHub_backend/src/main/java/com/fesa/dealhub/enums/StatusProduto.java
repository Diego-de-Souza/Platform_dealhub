package com.fesa.dealhub.enums;

public enum StatusProduto {
    ATIVO("Ativo"),
    INATIVO("Inativo"),
    DESCONTINUADO("Descontinuado");

    private final String label;

    StatusProduto(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

