package com.polyglot.repository;

import com.polyglot.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepo extends JpaRepository<Course, Integer> {

    List<Course> findAll();
}
