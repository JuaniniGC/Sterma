package com.sterma.back.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
@Getter
@Setter
@Table(name = "common_mistakes")
public class CommonMistakes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String identificator;

    @Column(nullable = false)
    private String description;

    public CommonMistakes() {
    }
}
