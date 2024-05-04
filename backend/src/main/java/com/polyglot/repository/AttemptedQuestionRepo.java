package com.polyglot.repository;

import com.polyglot.entity.AttemptedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptedQuestionRepo extends JpaRepository<AttemptedQuestion, Integer> {

    List<AttemptedQuestion> findAll();
}
