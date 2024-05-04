package com.polyglot.repository;

import com.polyglot.entity.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionAnswerRepo extends JpaRepository<QuestionAnswer, Integer> {

    List<QuestionAnswer> findAll();
}
