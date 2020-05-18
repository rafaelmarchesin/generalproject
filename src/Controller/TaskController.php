<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TaskController extends AbstractController
{
    public function indexAction()
    {
        return $this->render('Task/task.twig');
    }
}