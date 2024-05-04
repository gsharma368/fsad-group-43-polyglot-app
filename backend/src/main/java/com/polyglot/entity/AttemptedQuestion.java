package com.polyglot.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "attemptedquestion")
@Data
public class AttemptedQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private QuestionAnswer questionAnswer;
    private String response;
    private String attemptDateTime;
    private Integer marks;
    private Integer userId;
}
