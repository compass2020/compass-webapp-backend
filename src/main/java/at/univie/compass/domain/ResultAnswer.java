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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A ResultAnswer.
 */
@Entity
@Table(name = "result_answer")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResultAnswer extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "text", nullable = false)
    private String text;

    @NotNull
    @Column(name = "correct", nullable = false)
    private Boolean correct;

    @Column(name = "answered_correctly")
    private Boolean answeredCorrectly;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnore // parent nie im json liefern
    @JsonIgnoreProperties(value = "resultAnswers", allowSetters = true)
    private ResultQuestion resultQuestion;

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

    public ResultAnswer text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean isCorrect() {
        return correct;
    }

    public ResultAnswer correct(Boolean correct) {
        this.correct = correct;
        return this;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public Boolean isAnsweredCorrectly() {
        return answeredCorrectly;
    }

    public ResultAnswer answeredCorrectly(Boolean answeredCorrectly) {
        this.answeredCorrectly = answeredCorrectly;
        return this;
    }

    public void setAnsweredCorrectly(Boolean answeredCorrectly) {
        this.answeredCorrectly = answeredCorrectly;
    }

    public ResultQuestion getResultQuestion() {
        return resultQuestion;
    }

    public ResultAnswer resultQuestion(ResultQuestion resultQuestion) {
        this.resultQuestion = resultQuestion;
        return this;
    }

    public void setResultQuestion(ResultQuestion resultQuestion) {
        this.resultQuestion = resultQuestion;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResultAnswer)) {
            return false;
        }
        return id != null && id.equals(((ResultAnswer) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ResultAnswer{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", correct='" + isCorrect() + "'" +
            ", answeredCorrectly='" + isAnsweredCorrectly() + "'" +
            "}";
    }
}
