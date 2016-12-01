<?php

require_once('lib/bootstrap.php');

use Kirby\Plugins\ImageSet\ImageSet;

class ParameterTest extends ImageSetTestCase {

  public $kirby;
  public $site;
  public $testImage;

  public function setUp() {
    $this->kirby     = $this->kirbyInstance();
    $this->site      = $this->siteInstance($this->kirby);
    $this->testImage = $this->site->image();
  }

  // Number as String
  public function testSingleStringValue() {
    $this->assertEquals([
      ['width' => 200]
    ], ImageSet::parseSizesDescriptor('200'));
  }

  // Number as Integer
  public function testSingleIntegerValue() {
    $this->assertEquals([
      ['width' => 200]
    ], ImageSet::parseSizesDescriptor(200));
  }

  // Multiple Sizes as String
  public function testMultipleSizesAsString() {
    $this->assertEquals([
      ['width' => 200],
      ['width' => 400],
      ['width' => 600],
    ], ImageSet::parseSizesDescriptor('200,400,600'));
  }

  // Mutliple Sizes as String wrapped in array
  public function testMultipleSizesAsStringWrappedInArray() {
    $this->assertEquals([
      ['width' => 200],
      ['width' => 400],
      ['width' => 600],
    ], ImageSet::parseSizesDescriptor(['200,400,600']));
  }

  // [200, 400, 600]
  public function testSimpleArray() {
    $this->assertEquals([
      ['width' => 200],
      ['width' => 400],
      ['width' => 600],
    ], ImageSet::parseSizesDescriptor([200, 400, 600]));
  }

  // [0, 400, 600]
  public function testSimpleArrayWithZeroValue() {
    $this->expectException('Exception');
    ImageSet::parseSizesDescriptor([0, 400, 600]);
  }

  // '200-600'
  public function testRange() {
    $this->assertEquals([
      ['width' => 200],
      ['width' => 333],
      ['width' => 467],
      ['width' => 600],
    ], ImageSet::parseSizesDescriptor('200-600'));
  }

  // '0-600'
  public function testRangeWithZeroValue() {
    $this->expectException('Exception');
    ImageSet::parseSizesDescriptor('0-600');
  }
  
  // Different amount of intermediate sizes
  public function testRangeWithIntermediateSizes() {
    $this->assertEquals([
      ['width' => 200],
      ['width' => 300],
      ['width' => 400],
      ['width' => 500],
      ['width' => 600],
    ], ImageSet::parseSizesDescriptor('200-600,3'));
    

    $this->assertEquals([
      ['width' => 200],
      ['width' => 280],
      ['width' => 360],
      ['width' => 440],
      ['width' => 520],
      ['width' => 600],
    ], ImageSet::parseSizesDescriptor('200-600,4'));
    

    $this->assertEquals([
      ['width' => 200],
      ['width' => 267],
      ['width' => 333],
      ['width' => 400],
      ['width' => 467],
      ['width' => 533],
      ['width' => 600],
    ], ImageSet::parseSizesDescriptor('200-600,5'));
  }

  // Zero Intermediate Sizes
  public function testRangeWithZeroValueSizes() {
    $this->expectException('Exception');
    ImageSet::parseSizesDescriptor('0-600');
  }

  public function testRangeWithZeroIntermediateSizes() {
    $this->expectException('Exception');
    ImageSet::parseSizesDescriptor('0-600, 0');
  }

  public function testSingleCropValue() {
    $this->assertEquals([
      ['width' => 400, 'height' => 300, 'crop' => true],
    ], ImageSet::parseSizesDescriptor('400x300'));
  }

  public function testSingleCropValueWithZero() {
    $this->expectException('Exception');
    ImageSet::parseSizesDescriptor('400x0');
  }

  public function testMultipleCropValues() {
    $this->assertEquals(
      [
        [ 'width' => 400, 'height' => 300, 'crop' => true],
        [ 'width' => 600, 'height' => 200, 'crop' => true],
      ],
      ImageSet::parseSizesDescriptor('400x300,600x200')
    );
  }

  public function testCropRangeValues() {
    $this->assertEquals(
      [
        [ 'width' => 300, 'height' => 200, 'crop' => true ],
        [ 'width' => 500, 'height' => 333, 'crop' => true ],
        [ 'width' => 700, 'height' => 467, 'crop' => true ],
        [ 'width' => 900, 'height' => 600, 'crop' => true ],
      ],
      ImageSet::parseSizesDescriptor('300x200-900x600')
    );
  }

  public function testCropRangeValuesWithIntermadiateSizesParameter() {
    $this->assertEquals(
      [
        [ 'width' => 400, 'height' => 200, 'crop' => true ],
        [ 'width' => 480, 'height' => 240, 'crop' => true ],
        [ 'width' => 560, 'height' => 280, 'crop' => true ],
        [ 'width' => 640, 'height' => 320, 'crop' => true ],
        [ 'width' => 720, 'height' => 360, 'crop' => true ],
        [ 'width' => 800, 'height' => 400, 'crop' => true ],
      ],
      ImageSet::parseSizesDescriptor('400x200-800x400,4')
    );
  }

  public function testInvalidDifferentRatioCropRangeValues() {
    $this->expectException('Exception');
    ImageSet::parseSizesDescriptor('400x200-800x500,4');
  }
 
}
