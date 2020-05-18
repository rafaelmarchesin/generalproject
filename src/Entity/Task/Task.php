<?php

namespace App\Entity\Task;

/**
 * @Entity
 * @Table(name="task")
 */
class Task
{
    /**
     * @Column(type="integer", name="task_id", length=4, unique=true, nullable=false)
     * @GeneratedValue
     */
    private $id;

    /**
     * @Column(type="string", length=255, nullable=false)
     */
    private $task;

    /**
     * @Column(type="datetime", length=4, nullable=false)
     */
    private $date;

    /**
     * @Column(type="integer", length=1, nullable=false)
     */
    private $done;

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of task
     */ 
    public function getTask()
    {
        return $this->task;
    }

    /**
     * Set the value of task
     *
     * @return  self
     */ 
    public function setTask($task)
    {
        $this->task = $task;

        return $this;
    }

    /**
     * Get the value of data
     */ 
    public function getDate()
    {
        return $this->data;
    }

    /**
     * Set the value of data
     *
     * @return  self
     */ 
    public function setDate($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Get the value of done
     */ 
    public function getDone()
    {
        return $this->done;
    }

    /**
     * Set the value of done
     *
     * @return  self
     */ 
    public function setDone($done)
    {
        $this->done = $done;

        return $this;
    }
}