<?php 

class ImageSetTestCase extends PHPUnit_Framework_TestCase {

  public function kirbyInstance($options = array()) {

    c::$data = array();

    $kirby = new Kirby($options);
    $kirby->roots->content  = TEST_ROOT_ETC . DS . 'content';
    $kirby->roots->accounts = TEST_ROOT_ETC . DS . 'site' . DS . 'accounts';
    $kirby->roots->thumbs   = TEST_ROOT_ETC . DS . 'thumbs';
    
    // Load ImageSet Plugin 
    $kirby->plugins = null;
    $kirby->roots->plugins  = realpath(PARENT_KIRBY_ROOT . DS . 'site' . DS . 'plugins');
    $kirby->plugins();
    
    return $kirby;

  }

  public function siteInstance($kirby = null, $options = array()) {

    $kirby = !is_null($kirby) ? $kirby : $this->kirbyInstance($options);
    $site  = new Site($kirby);

    return $site;

  }

}
