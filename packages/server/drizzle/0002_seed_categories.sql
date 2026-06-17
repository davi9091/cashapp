-- Seed default system categories (group_id IS NULL = available to all groups)

INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Food & Drink',  '🍔', '#F97316', NULL, NULL),
  ('Transport',     '🚗', '#3B82F6', NULL, NULL),
  ('Housing',       '🏠', '#8B5CF6', NULL, NULL),
  ('Health',        '🏥', '#EF4444', NULL, NULL),
  ('Entertainment', '🎬', '#EC4899', NULL, NULL),
  ('Shopping',      '🛍️', '#F59E0B', NULL, NULL),
  ('Income',        '💰', '#22C55E', NULL, NULL),
  ('Savings',       '🏦', '#06B6D4', NULL, NULL),
  ('Education',     '📚', '#6366F1', NULL, NULL),
  ('Travel',        '✈️', '#14B8A6', NULL, NULL);

-- Subcategories for Food & Drink (parent_id = 1)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Groceries',   '🛒', '#F97316', 1, NULL),
  ('Restaurants', '🍽️', '#F97316', 1, NULL),
  ('Coffee',      '☕', '#F97316', 1, NULL);

-- Subcategories for Transport (parent_id = 2)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Public Transit', '🚌', '#3B82F6', 2, NULL),
  ('Fuel',           '⛽', '#3B82F6', 2, NULL),
  ('Parking',        '🅿️', '#3B82F6', 2, NULL);

-- Subcategories for Housing (parent_id = 3)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Rent',      '🔑', '#8B5CF6', 3, NULL),
  ('Utilities', '💡', '#8B5CF6', 3, NULL),
  ('Internet',  '📡', '#8B5CF6', 3, NULL);

-- Subcategories for Health (parent_id = 4)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Medical',  '🩺', '#EF4444', 4, NULL),
  ('Pharmacy', '💊', '#EF4444', 4, NULL),
  ('Gym',      '🏋️', '#EF4444', 4, NULL);

-- Subcategories for Entertainment (parent_id = 5)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Streaming', '📺', '#EC4899', 5, NULL),
  ('Games',     '🎮', '#EC4899', 5, NULL),
  ('Events',    '🎟️', '#EC4899', 5, NULL);

-- Subcategories for Shopping (parent_id = 6)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Clothing',     '👗', '#F59E0B', 6, NULL),
  ('Electronics',  '📱', '#F59E0B', 6, NULL);

-- Subcategories for Income (parent_id = 7)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Salary',     '💼', '#22C55E', 7, NULL),
  ('Freelance',  '🧑‍💻', '#22C55E', 7, NULL),
  ('Investment', '📈', '#22C55E', 7, NULL);
