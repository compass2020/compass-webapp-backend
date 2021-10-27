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

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import at.univie.compass.domain.enumeration.Difficulty;
import at.univie.compass.domain.enumeration.QuestionType;

/**
 * A ResultQuestion.
 */
@Entity
@Table(name = "result_question")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResultQuestion extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "text", nullable = false)
    private String text;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private QuestionType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false)
    private Difficulty difficulty;

    @Column(name = "answered_correctly")
    private Boolean answeredCorrectly;

    @OneToMany(mappedBy = "resultQuestion", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
//  @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ResultAnswer> resultAnswers = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "resultQuestions", allowSetters = true)
    private Category category;

    @ManyToMany(mappedBy = "resultQuestions")
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnore
    private Set<ResultControlpoint> resultControlpoints = new HashSet<>();

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

    public ResultQuestion text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public QuestionType getType() {
        return type;
    }

    public ResultQuestion type(QuestionType type) {
        this.type = type;
        return this;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public ResultQuestion difficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
        return this;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Boolean isAnsweredCorrectly() {
        return answeredCorrectly;
    }

    public ResultQuestion answeredCorrectly(Boolean answeredCorrectly) {
        this.answeredCorrectly = answeredCorrectly;
        return this;
    }

    public void setAnsweredCorrectly(Boolean answeredCorrectly) {
        this.answeredCorrectly = answeredCorrectly;
    }

    public Set<ResultAnswer> getResultAnswers() {
        return resultAnswers;
    }

    public ResultQuestion resultAnswers(Set<ResultAnswer> resultAnswers) {
        this.resultAnswers = resultAnswers;
        return this;
    }

    public ResultQuestion addResultAnswer(ResultAnswer resultAnswer) {
        this.resultAnswers.add(resultAnswer);
        resultAnswer.setResultQuestion(this);
        return this;
    }

    public ResultQuestion removeResultAnswer(ResultAnswer resultAnswer) {
        this.resultAnswers.remove(resultAnswer);
        resultAnswer.setResultQuestion(null);
        return this;
    }

    public void setResultAnswers(Set<ResultAnswer> resultAnswers) {
        this.resultAnswers = resultAnswers;
    }

    public Category getCategory() {
        return category;
    }

    public ResultQuestion category(Category category) {
        this.category = category;
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Set<ResultControlpoint> getResultControlpoints() {
        return resultControlpoints;
    }

    public ResultQuestion resultControlpoints(Set<ResultControlpoint> resultControlpoints) {
        this.resultControlpoints = resultControlpoints;
        return this;
    }

    public ResultQuestion addResultControlpoint(ResultControlpoint resultControlpoint) {
        this.resultControlpoints.add(resultControlpoint);
        resultControlpoint.getResultQuestions().add(this);
        return this;
    }

    public ResultQuestion removeResultControlpoint(ResultControlpoint resultControlpoint) {
        this.resultControlpoints.remove(resultControlpoint);
        resultControlpoint.getResultQuestions().remove(this);
        return this;
    }

    public void setResultControlpoints(Set<ResultControlpoint> resultControlpoints) {
        this.resultControlpoints = resultControlpoints;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResultQuestion)) {
            return false;
        }
        return id != null && id.equals(((ResultQuestion) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ResultQuestion{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", type='" + getType() + "'" +
            ", difficulty='" + getDifficulty() + "'" +
            ", answeredCorrectly='" + isAnsweredCorrectly() + "'" +
            "}";
    }
}
