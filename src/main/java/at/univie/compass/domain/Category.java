/*-
 * #%L
 * COMPASS orienteering game
 * %%
 * Copyright (C) 2021 University of Vienna
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
package at.univie.compass.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Category.
 */
@Entity
@Table(name = "category")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "text", nullable = false)
    private String text;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Question> questions = new HashSet<>();

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ResultQuestion> resultQuestions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public Category text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Set<Question> getQuestions() {
        return questions;
    }

    public Category questions(Set<Question> questions) {
        this.questions = questions;
        return this;
    }

    public Category addQuestion(Question question) {
        this.questions.add(question);
        question.setCategory(this);
        return this;
    }

    public Category removeQuestion(Question question) {
        this.questions.remove(question);
        question.setCategory(null);
        return this;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }

    public Set<ResultQuestion> getResultQuestions() {
        return resultQuestions;
    }

    public Category resultQuestions(Set<ResultQuestion> resultQuestions) {
        this.resultQuestions = resultQuestions;
        return this;
    }

    public Category addResultQuestion(ResultQuestion resultQuestion) {
        this.resultQuestions.add(resultQuestion);
        resultQuestion.setCategory(this);
        return this;
    }

    public Category removeResultQuestion(ResultQuestion resultQuestion) {
        this.resultQuestions.remove(resultQuestion);
        resultQuestion.setCategory(null);
        return this;
    }

    public void setResultQuestions(Set<ResultQuestion> resultQuestions) {
        this.resultQuestions = resultQuestions;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Category)) {
            return false;
        }
        return id != null && id.equals(((Category) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Category{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            "}";
    }
}
